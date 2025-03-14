"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg shadow-sm bg-theme-secondary">
      <div className="container">
        <a className="navbar-brand font-bold text-2xl text-theme" href="/">
          ER
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            er
          </span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-theme" href="#">
                실험체 분석
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-theme" href="#">
                랭킹
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-theme" href="#">
                E-스포츠
              </a>
            </li>
          </ul>
          <div className="d-flex ms-3">
            <button
              className="btn btn-outline-secondary me-2 text-theme border-theme"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="btn btn-outline-secondary text-theme border-theme">
              🇰🇷
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
