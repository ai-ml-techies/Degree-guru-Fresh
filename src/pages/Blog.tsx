import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_POSTS, BlogPost } from "@/data/blogs";
import { BookOpen, Clock, Calendar, ArrowRight, Search, Sparkles } from "lucide-react";

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const categories = [
    "All",
    "University Comparisons",
    "Online Degrees",
    "Resume",
    "Career",
  ];

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === "All") return matchesSearch;
    return matchesSearch && post.category === selectedCategory;
  });

  return (
    <>
      <Helmet>
        <title>Degree Guru Blog - Online Degrees, University Comparisons & Career Guides</title>
        <meta
          name="description"
          content="In-depth, factual guides on online education, IGNOU vs Online Universities, DU SOL comparisons, online MBA specializations, and career acceleration."
        />
        <link rel="canonical" href="https://degreeguru.in/blog/" />
      </Helmet>

      <div className="container-dg py-8 md:py-14">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <BookOpen size={14} /> Career & Education Knowledge Hub
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Education, Career & Resume Insights
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
            Factual comparisons, industry salary insights, and practical advice to help you decide your next educational step.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search guides (e.g. IGNOU, DU SOL, Online MBA, ATS Resume)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-3 leading-snug">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>

                {/* Related tags */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/50">
                  {post.relatedCourses.map((rc, idx) => (
                    <Link
                      key={idx}
                      to={rc.url}
                      className="px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary text-[11px] font-semibold transition-colors"
                    >
                      {rc.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{post.publishDate}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Read Full Guide <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Blog;
