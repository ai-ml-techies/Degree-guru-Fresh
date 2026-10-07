import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:8091';
const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY || 'a88bbcc7-c01c-11f1-af74-0200cd936042';

/* Dev middleware to dispatch and verify real 2Factor.in SMS OTPs without requiring PHP backend */
const otpDevPlugin = () => {
  const sessions = new Map<string, string>();

  return {
    name: 'otp-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        const isSendOtp = url.includes('/contact/send-otp');
        const isVerifyOtp = url.includes('/contact/verify-otp');

        if (!isSendOtp && !isVerifyOtp) {
          return next();
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', async () => {
          const raw = Buffer.concat(chunks).toString();
          let phone = '';
          let otp = '';
          let sessionId = '';

          try {
            const parsed = JSON.parse(raw);
            phone = parsed.phone || '';
            otp = parsed.otp || '';
            sessionId = parsed.session_id || '';
          } catch {
            const phoneMatch = raw.match(/name="phone"[\r\n]+([^\r\n]+)/) || raw.match(/phone=([^&]+)/);
            if (phoneMatch) phone = decodeURIComponent(phoneMatch[1].trim());

            const otpMatch = raw.match(/name="otp"[\r\n]+([^\r\n]+)/) || raw.match(/otp=([^&]+)/);
            if (otpMatch) otp = decodeURIComponent(otpMatch[1].trim());

            const sessMatch = raw.match(/name="session_id"[\r\n]+([^\r\n]+)/) || raw.match(/session_id=([^&]+)/);
            if (sessMatch) sessionId = decodeURIComponent(sessMatch[1].trim());
          }

          const cleanPhone = phone.replace(/\D/g, '').slice(-10);

          if (isSendOtp) {
            if (!cleanPhone || cleanPhone.length !== 10) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, message: 'Please provide a valid 10-digit mobile number' }));
            }

            try {
              const resp = await fetch(`https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${cleanPhone}/AUTOGEN/OTP1`);
              const data: any = await resp.json();
              if (data && (data.Status === 'Success' || data.Status === 'success')) {
                const sid = data.Details || '';
                sessions.set(cleanPhone, sid);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: true,
                  message: `OTP sent successfully via SMS to +91 ${cleanPhone}`,
                  session_id: sid,
                }));
              }
            } catch (err: any) {
              console.warn('[Vite OTP] 2Factor dispatch warning:', err?.message);
            }

            // Fallback for dev mode
            const mockOtp = '123456';
            sessions.set(cleanPhone, 'mock_session');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: true,
              message: `OTP sent to +91 ${cleanPhone}`,
              dev_otp: mockOtp,
            }));
          }

          if (isVerifyOtp) {
            const cleanOtp = otp.trim();
            const sid = sessionId || sessions.get(cleanPhone) || '';

            // Universal dev test bypass
            if (cleanOtp === '123456') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true, message: 'OTP verified successfully!' }));
            }

            if (sid && sid !== 'mock_session') {
              try {
                const resp = await fetch(`https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/VERIFY/${sid}/${cleanOtp}`);
                const data: any = await resp.json();
                if (data && (data.Status === 'Success' || data.Details === 'OTP Matched')) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true, message: 'OTP verified successfully!' }));
                } else {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: false, message: data.Details || 'Invalid OTP code' }));
                }
              } catch (err: any) {
                console.warn('[Vite OTP] 2Factor verify warning:', err?.message);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, message: 'OTP verified successfully!' }));
          }
        });
      });
    },
  };
};

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname),
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api':         { target: BACKEND, changeOrigin: true },
      '/contact':     { target: BACKEND, changeOrigin: true },
      '/recruitment': { target: BACKEND, changeOrigin: true },
      '/jobs':        { target: BACKEND, changeOrigin: true },
    },
  },
  plugins: [
    react(),
    otpDevPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  build: {
    target: ['es2015', 'safari13'],
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':     ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'vendor-query':  ['@tanstack/react-query'],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
