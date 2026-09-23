import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_POSTS } from "@/data/blogs";
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Compass, Calculator, FileText, CheckCircle2 } from "lucide-react";

export const BlogPost = () => {
  const { postSlug } = useParams<{ postSlug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === postSlug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Degree Guru</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://degreeguru.in/blog/${post.slug}/`} />
      </Helmet>

      <div className="container-dg py-8 md:py-14 max-w-4xl">
        {/* Breadcrumbs & Back button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/blog"
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to All Guides
          </Link>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
        </div>

        {/* Title Header */}
        <header className="mb-8 space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1"><Calendar size={13} /> {post.publishDate}</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
            <span>By Academic Research Team</span>
          </div>
        </header>

        {/* Content Box */}
        <article className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-md space-y-6">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
            {post.contentMarkdown}
          </div>

          {/* Connected Ecosystem Links (Prompt Rules #36 & #58) */}
          <div className="mt-10 pt-6 border-t border-border/60 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Recommended Next Steps & Free Tools:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Courses */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70">
                <span className="text-xs font-bold text-foreground block mb-2">Related Online Degrees</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.relatedCourses.map((c, i) => (
                    <Link
                      key={i}
                      to={c.url}
                      className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {c.name} <ArrowRight size={11} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Free Tools */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70">
                <span className="text-xs font-bold text-foreground block mb-2">Related Career Tools</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.relatedTools.map((t, i) => (
                    <Link
                      key={i}
                      to={t.url}
                      className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1"
                    >
                      {t.name} <ArrowRight size={11} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Counseling CTA Banner */}
        <div className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd] text-white text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">Still Unsure Which University Fits You Best?</h3>
          <p className="text-xs sm:text-sm text-white/85 max-w-lg mx-auto leading-relaxed">
            Talk to Degree Guru's academic mentors for 100% unbiased guidance across fee structures, UGC approvals, and exam schedules.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/courses"
              className="px-6 py-2.5 rounded-full bg-white text-primary text-xs sm:text-sm font-extrabold hover:bg-neutral-100 transition-all shadow-md"
            >
              Explore Online Degrees
            </Link>
            <a
              href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20read%20your%20blog%20and%20need%20clarification"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogPost;
