"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const languages = [
  { code: "en-us", label: "English" },
  { code: "fr-fr", label: "French" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState("en-us");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang") || "en-us";
    setCurrentLang(lang);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const params = new URLSearchParams(window.location.search);
    
    if (newLang === "en-us") {
      params.delete("lang"); // Remove lang param for default English
    } else {
      params.set("lang", newLang);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl);
    setCurrentLang(newLang);
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="p-2 rounded border border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
