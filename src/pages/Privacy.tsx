const Privacy = () => (
  <section className="py-24">
    <div className="container-dg max-w-[800px]">
      <div className="bg-card text-card-foreground rounded-3xl p-10 md:p-14 shadow-xl border border-border">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Privacy Policy</h1>
        <p className="text-soft mb-10">Last updated: 2026. Friendly, clear, no fine-print games.</p>

        {[
          { t: "Information We Collect", b: "When you request counseling, we collect your name, phone, email, date of birth and message. That is it. Nothing more." },
          { t: "How We Use It", b: "We use your details only to call you back, share program recommendations, and connect you with partner universities you ask about." },
          { t: "Data Protection", b: "Your details are stored securely. Access is limited to authorised counselors. We never sell your data." },
          { t: "Third Party Sharing", b: "We share your information only with the universities you choose to apply to. We never share with marketers or unrelated third parties." },
          { t: "Your Rights", b: "You can ask us to update or delete your data at any time. Just email us." },
          { t: "Contact", b: "Questions about privacy? Email admissions@degreeguru.in. We will get back to you fast." },
        ].map((s) => (
          <div key={s.t} className="mb-8">
            <h2 className="text-xl font-bold mb-2">{s.t}</h2>
            <p className="text-soft leading-relaxed">{s.b}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Privacy;
