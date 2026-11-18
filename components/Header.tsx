"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, type NavItem } from "@/lib/site";
import { Logo } from "./Logo";
import { IconChevron, IconClose, IconMenu, IconSearch } from "./Icons";
import { SearchDialog } from "./SearchDialog";

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

function Dropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = isActive(pathname, item.href) || item.children!.some((c) => isActive(pathname, c.href));

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        (ref.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <li
      ref={ref}
      className={`nav-item ${open ? "open" : ""}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={`nav-link ${active ? "active" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
      >
        {item.label}
        <IconChevron className="chev" />
      </button>
      <div className="dropdown">
        <ul>
          {item.children!.map((c) => (
            <li key={c.href}>
              <Link href={c.href} aria-current={pathname === c.href ? "page" : undefined}>
                <span className="dd-title">{c.label}</span>
                {c.description && <span className="dd-desc">{c.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Header() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /INPUT|TEXTAREA|SELECT/.test(target.tagName) || target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Desktop shows a condensed nav: the Research dropdown already contains the
  // Gurgaon briefs, so we skip the duplicate top-level link there.
  const desktopNav = mainNav.filter((n) => n.href !== "/gurgaon-briefs");

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="nav-desktop" aria-label="Main">
            <ul>
              {desktopNav.map((item) =>
                item.children ? (
                  <Dropdown key={item.label} item={item} pathname={pathname} />
                ) : (
                  <li key={item.href} className="nav-item">
                    <Link href={item.href} className="nav-link" aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search the site">
              <IconSearch />
            </button>
            <Link href="/research" className="btn btn-sm header-cta">
              Research Library
            </Link>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-nav" className={`mobile-nav ${menuOpen ? "open" : ""}`} aria-label="Mobile" aria-hidden={!menuOpen} inert={!menuOpen}>
        <ul>
          {mainNav.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="m-link" aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                {item.label}
              </Link>
              {item.children && (
                <ul className="m-sub">
                  {item.children
                    .filter((c) => c.href !== item.href)
                    .map((c) => (
                      <li key={c.href}>
                        <Link href={c.href}>{c.label}</Link>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link href="/contact" className="m-link" aria-current={pathname === "/contact" ? "page" : undefined}>
              Contact
            </Link>
          </li>
        </ul>
        <Link href="/research" className="btn">
          Explore the Research Library
        </Link>
      </nav>

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
