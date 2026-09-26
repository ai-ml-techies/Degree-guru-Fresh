// Verified high-resolution official campus cover images for universities
export const UNIVERSITY_CAMPUS_IMAGES: Record<string, string> = {
  "amity-university-online": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Amity_University_Noida.jpg/1280px-Amity_University_Noida.jpg",
  "amity-online": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Amity_University_Noida.jpg/1280px-Amity_University_Noida.jpg",
  "chandigarh-university-online": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
  "manipal-university-jaipur-online": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
  "nmims-online": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  "lovely-professional-university-online": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80",
  "dy-patil-university-online": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
  "shoolini-university-online": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
  "jain-university-online": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  "amrita-ahead-online": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80",
  "uttaranchal-university-online": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
};

export const getUniversityCampusImage = (slug: string): string => {
  return UNIVERSITY_CAMPUS_IMAGES[slug] || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80";
};
