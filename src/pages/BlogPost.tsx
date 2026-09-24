import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_POSTS } from "@/data/blogs";
import {
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  WhatsAppCircleIcon,
  FacebookCircleIcon,
  LinkedInCircleIcon,
  XCircleIcon,
} from "@/components/SocialIcons";

export const BlogPost = () => {
  const { postSlug } = useParams<{ postSlug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === postSlug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://degreeguru.in/blog/${post.slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug);
  const recentPosts = otherPosts.slice(0, 4);
  const relatedPosts = otherPosts.slice(0, 3);

  const specializations = [
    { label: "Online MBA", href: "/courses/management/online-mba" },
    { label: "Online MCA", href: "/courses/it-computer/online-mca" },
    { label: "Data Science & AI", href: "/courses/it-computer/online-mca" },
    { label: "Executive BBA", href: "/courses/management/online-bba" },
    { label: "FinTech & Banking", href: "/courses/commerce/online-mcom" },
    { label: "Digital Marketing", href: "/courses/management/online-mba" },
    { label: "Healthcare Mgmt", href: "/courses/management/online-mba" },
  ];

  // Helper to format inline markdown without raw asterisks
  const renderFormattedInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={idx} className="font-extrabold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={idx} className="italic text-foreground/90 font-medium">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part.replace(/\*\*/g, "");
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Degree Guru Research</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://degreeguru.in/blog/${post.slug}/`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="bg-background min-h-screen pb-20">
        {/* Top Breadcrumb Nav — Goes directly: Home > Blog > {post.title} */}
        <div className="border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-16 z-20">
          <div className="container-dg py-2.5 flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold truncate">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 shrink-0">
                <Home size={13} />
                <span>Home</span>
              </Link>
              <ChevronRight size={12} className="text-muted-foreground/50 shrink-0" />
              <Link to="/blog" className="hover:text-primary transition-colors shrink-0">
                Blog
              </Link>
              <ChevronRight size={12} className="text-muted-foreground/50 shrink-0" />
              <span className="text-foreground font-bold truncate max-w-[320px] sm:max-w-[540px]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Article Container with reduced top spacing */}
        <div className="container-dg pt-4 md:pt-7 max-w-6xl">
          {/* Category Pill & Read Time */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider mb-4 border border-purple-200 dark:border-purple-800/50">
            <span>{post.category}</span>
            <span className="text-purple-400">·</span>
            <span>{post.readTime}</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.16] mb-6">
            {post.title}
          </h1>

          {/* Author and Social Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70 mb-8">
            {/* Author Info: Clickable Yash opening /author/yash in a new page */}
            <div className="flex items-center gap-3.5">
              <Link
                to="/author/yash"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 bg-muted shrink-0 hover:scale-105 hover:border-primary transition-all shadow-sm group block"
                title="View Yash's profile & articles (opens in new tab)"
              >
                <img
                  src={post.author.avatar || "/assets/yash-avatar.svg"}
                  alt={post.author.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/author/yash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-black text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    title="View Yash's profile & articles (opens in new tab)"
                  >
                    <span>{post.author.name}</span>
                    {post.author.verified && (
                      <span title="Verified Academic Editor" className="inline-flex items-center text-blue-500">
                        <svg className="w-4 h-4 fill-blue-500 text-white" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                        </svg>
                      </span>
                    )}
                  </Link>

                  {/* LinkedIn Icon in front of writer name linking to Yash's LinkedIn profile */}
                  <a
                    href={post.author.linkedin || "https://www.linkedin.com/in/yashappy"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Yash on LinkedIn"
                    title="Connect with Yash on LinkedIn"
                    className="w-5 h-5 rounded-md bg-[#0077b5] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs shrink-0"
                  >
                    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                    </svg>
                  </a>
                </div>
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 flex-wrap">
                  <Link
                    to="/author/yash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground/85 hover:text-primary hover:underline"
                  >
                    {post.author.role}
                  </Link>
                  <span>·</span>
                  <span className="text-foreground/80">
                    {post.author.experience || "Over 3.5 years of experience in marketing and brand building"}
                  </span>
                  <span>·</span>
                  <span>{post.publishDate}</span>
                </div>
              </div>
            </div>

            {/* Share in Feed: WhatsApp, LinkedIn, Facebook, and X (HD Circular Logos, reduced size) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1">Share</span>
              
              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                title="Share on WhatsApp"
                className="hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                <WhatsAppCircleIcon className="w-8 h-8 rounded-full shadow-sm hover:shadow-md" />
              </a>

              {/* LinkedIn Share to Feed */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share to LinkedIn Feed"
                title="Share to LinkedIn Feed"
                className="hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                <LinkedInCircleIcon className="w-8 h-8 rounded-full shadow-sm hover:shadow-md" />
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                title="Share on Facebook"
                className="hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                <FacebookCircleIcon className="w-8 h-8 rounded-full shadow-sm hover:shadow-md" />
              </a>

              {/* Twitter / X Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                title="Share on X"
                className="hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                <XCircleIcon className="w-8 h-8 rounded-full shadow-sm hover:shadow-md" />
              </a>
            </div>
          </div>

          {/* Hero Featured Image */}
          <div className="relative w-full aspect-[21/10] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border border-border/80 mb-10 bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Two-Column Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Main Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Executive Summary & Key Takeaways Card */}
              {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#f5f3ff] dark:bg-purple-950/25 border border-purple-200/90 dark:border-purple-800/40 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                    <Sparkles size={15} className="text-purple-600 dark:text-purple-400" />
                    <span>Executive Summary & Key Takeaways</span>
                  </div>

                  <ul className="space-y-2.5 pt-0.5">
                    {post.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-snug text-foreground/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 mt-2 shrink-0" />
                        <div>
                          <strong className="font-extrabold text-foreground">{item.title}: </strong>
                          <span className="text-foreground/80">{renderFormattedInline(item.desc)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* In This Market Analysis Pills */}
              {post.toc && post.toc.length > 0 && (
                <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <BookOpen size={14} />
                    <span>In This Analysis</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.toc.map((section, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-muted hover:bg-primary/10 text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer border border-border/60"
                      >
                        {section.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Editorial Body: Clean Parsing with NO Raw Asterisks */}
              <article className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-md">
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-5 text-foreground/90 leading-relaxed font-sans">
                  {post.contentMarkdown.split("\n\n").map((block, i) => {
                    const trimmed = block.trim();
                    if (!trimmed) return null;

                    if (trimmed.startsWith("### ")) {
                      return (
                        <h2 key={i} className="text-xl sm:text-2xl font-black text-foreground pt-4 pb-1 border-b border-border/60">
                          {trimmed.replace("### ", "")}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith("#### ")) {
                      return (
                        <h3 key={i} className="text-base sm:text-lg font-bold text-foreground pt-2">
                          {trimmed.replace("#### ", "")}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("| ")) {
                      // Render Markdown Table cleanly
                      const rows = trimmed.split("\n").filter((r) => !r.includes("---"));
                      const headerRow = rows[0]?.split("|").filter(Boolean).map((c) => c.trim());
                      const bodyRows = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));

                      return (
                        <div key={i} className="my-6 overflow-x-auto rounded-2xl border border-border">
                          <table className="w-full text-xs sm:text-sm text-left border-collapse">
                            <thead className="bg-muted text-foreground font-black border-b border-border">
                              <tr>
                                {headerRow.map((h, hi) => (
                                  <th key={hi} className="p-3 sm:p-3.5">
                                    {renderFormattedInline(h)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {bodyRows.map((row, ri) => (
                                <tr key={ri} className="hover:bg-muted/30 transition-colors">
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="p-3 sm:p-3.5 text-foreground/90 font-medium">
                                      {renderFormattedInline(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    if (trimmed === "---") {
                      return <hr key={i} className="my-6 border-border/60" />;
                    }

                    // Render bullet lists or numbered lists
                    if (trimmed.startsWith("- ") || trimmed.startsWith("1. ") || trimmed.startsWith("2. ")) {
                      const listItems = trimmed.split("\n").filter(Boolean);
                      return (
                        <ul key={i} className="space-y-2.5 my-3 pl-1">
                          {listItems.map((item, itemIdx) => {
                            const cleanItem = item.replace(/^[-•]\s+|\d+\.\s+/, "");
                            return (
                              <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed text-foreground/85">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <div>{renderFormattedInline(cleanItem)}</div>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }

                    // Standard paragraph with fully parsed inline formatting
                    return (
                      <p key={i} className="text-sm sm:text-base leading-relaxed text-foreground/85">
                        {renderFormattedInline(trimmed)}
                      </p>
                    );
                  })}
                </div>

                {/* Topics / Hashtags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground mr-1">Topics:</span>
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-muted text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>

              {/* Bottom Share Feedback Card with WhatsApp, LinkedIn, Facebook, and X */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-foreground">
                    Found this research analysis valuable?
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share directly with colleagues, classmates, or in your professional feed.
                  </p>
                </div>
                <div className="flex items-center flex-wrap gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                    className="hover:scale-105 active:scale-95 transition-transform shrink-0"
                  >
                    <WhatsAppCircleIcon className="w-8 h-8 rounded-full shadow-sm" />
                  </a>

                  {/* LinkedIn Share */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                    className="hover:scale-105 active:scale-95 transition-transform shrink-0"
                  >
                    <LinkedInCircleIcon className="w-8 h-8 rounded-full shadow-sm" />
                  </a>

                  {/* Facebook Share */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                    className="hover:scale-105 active:scale-95 transition-transform shrink-0"
                  >
                    <FacebookCircleIcon className="w-8 h-8 rounded-full shadow-sm" />
                  </a>

                  {/* X / Twitter Share */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    title="Share on X"
                    className="hover:scale-105 active:scale-95 transition-transform shrink-0"
                  >
                    <XCircleIcon className="w-8 h-8 rounded-full shadow-sm" />
                  </a>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition-all"
                  >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar Column */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start">
              {/* Private Academic Briefing CTA Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#4c1d95] via-[#5b21b6] to-[#7c3aed] text-white shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-lg font-black tracking-tight leading-snug">
                  Private Educational Briefing
                </h3>
                <p className="text-xs text-white/85 leading-relaxed">
                  Consult directly with our verified academic advisors for unbiased university selection, syllabus audits, and institutional fee waivers.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20book%20a%20private%20educational%20briefing"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-white text-purple-900 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all shadow-md group"
                  >
                    <span>BOOK PRIVATE BRIEFING</span>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                </div>
              </div>

              {/* Recent Reviews & Top Picks */}
              <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Recent Reviews & Top Picks
                </h4>
                <div className="space-y-3.5">
                  {recentPosts.map((rPost) => (
                    <Link
                      key={rPost.slug}
                      to={`/blog/${rPost.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={rPost.image}
                        alt={rPost.title}
                        className="w-16 h-14 rounded-xl object-cover shrink-0 border border-border/60 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {rPost.title}
                        </h5>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block">
                          {rPost.publishDate}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top Specializations to Explore */}
              <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Top Specializations to Explore
                </h4>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec, idx) => (
                    <Link
                      key={idx}
                      to={spec.href}
                      className="px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-primary/10 border border-border/60 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {spec.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Author Box — Yash Credentials & Link to his dedicated profile page */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <Link
                  to="/author/yash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shrink-0 shadow-sm hover:scale-105 transition-transform block bg-muted"
                  title="View Yash's Full Profile & Articles (opens in new tab)"
                >
                  <img
                    src={post.author.avatar || "/assets/yash-avatar.svg"}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/author/yash"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-black text-foreground hover:text-primary transition-colors"
                      title="View Yash's Full Profile & Articles (opens in new tab)"
                    >
                      {post.author.name}
                    </Link>
                    <span className="inline-flex items-center text-blue-500">
                      <svg className="w-4 h-4 fill-blue-500 text-white" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                      </svg>
                    </span>
                    <a
                      href={post.author.linkedin || "https://www.linkedin.com/in/yashappy"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-5 h-5 rounded-md bg-[#0077b5] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                      title="Connect with Yash on LinkedIn"
                    >
                      <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                      </svg>
                    </a>
                  </div>
                  <div className="text-xs font-bold text-primary">
                    {post.author.role} · {post.author.experience || "Over 3.5 years of experience in marketing and brand building"}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                    {post.author.bio}
                  </p>
                </div>
              </div>

              <Link
                to="/author/yash"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>View Yash's Profile & Articles</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Related Educational Analyses Section (Bottom) */}
          <div className="mt-16 pt-12 border-t border-border/70 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Related Educational Analyses
              </h3>
              <Link
                to="/blog"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View all research guides <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relPost) => (
                <Link
                  key={relPost.slug}
                  to={`/blog/${relPost.slug}`}
                  className="rounded-3xl bg-card border border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={relPost.image}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                        {relPost.category}
                      </span>
                      <h4 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {relPost.title}
                      </h4>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/40">
                    <span>{relPost.publishDate}</span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      {relPost.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogPost;
