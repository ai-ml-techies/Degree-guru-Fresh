import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_POSTS, YASH_AUTHOR } from "@/data/blogs";
import {
  Home,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";

export const AuthorDetail = () => {
  const { authorSlug } = useParams<{ authorSlug: string }>();

  // For now, Yash is our verified author
  const author = YASH_AUTHOR;

  if (authorSlug && authorSlug.toLowerCase() !== "yash") {
    return <Navigate to="/blog" replace />;
  }

  const authorArticles = BLOG_POSTS.filter((post) => post.author.slug === "yash");

  return (
    <>
      <Helmet>
        <title>{author.name} — {author.role} | Degree Guru</title>
        <meta
          name="description"
          content={`Profile of ${author.name}, ${author.role} at Degree Guru. ${author.experience}. ${author.education}.`}
        />
        <link rel="canonical" href="https://degreeguru.in/author/yash/" />
      </Helmet>

      <div className="bg-background min-h-screen pb-20">
        {/* Breadcrumb Bar */}
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
              <span className="text-foreground font-bold truncate">Author: {author.name}</span>
            </nav>
          </div>
        </div>

        {/* Author Profile Header */}
        <div className="container-dg pt-8 md:pt-12 max-w-5xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border/80 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 text-center md:text-left">
              {/* Cartoon Avatar */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shrink-0 bg-muted">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Author Info */}
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                    <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                      {author.name}
                    </h1>
                    {author.verified && (
                      <span title="Verified Author" className="inline-flex items-center text-blue-500">
                        <svg className="w-6 h-6 fill-blue-500 text-white" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                        </svg>
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {author.role}
                    </span>
                  </div>

                  {/* Badges: Research & Education */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3">
                    {author.experience ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/50 flex items-center gap-1.5">
                        <Briefcase size={14} className="text-purple-600 dark:text-purple-400" />
                        {author.experience}
                      </span>
                    ) : null}

                    {author.education ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5">
                        <GraduationCap size={15} className="text-emerald-600 dark:text-emerald-400" />
                        {author.education}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {author.bio}
                </p>

                {/* Social Connect */}
                <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0077b5] text-white text-xs font-bold hover:bg-[#006097] transition-all shadow-md hover:scale-105"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                    </svg>
                    <span>Connect on LinkedIn</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Written by Yash */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Articles Written by {author.name} ({authorArticles.length})
                </h2>
              </div>
              <Link to="/blog" className="text-xs font-bold text-primary hover:underline">
                View All Blog Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authorArticles.map((article) => (
                <div
                  key={article.slug}
                  className="rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-[10px] font-black uppercase tracking-wider shadow-sm border border-border/60">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{article.readTime}</span>
                        <span>·</span>
                        <span>{article.publishDate}</span>
                      </div>

                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                        <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Read Full Analysis</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorDetail;
