export default function Footer() {
  return (
    <footer className="ins-tile ins-tile--footer ins-tile--center" role="contentinfo" id="tile-footer-MNure7" tile-type="FOOTER" tile-id="footer-MNure7" is-first-tile-with-title="false" is-background-same-prev="false" tile-index-in-list="10">
      <style>{`
      #tile-footer-MNure7 {
          --background-gradient-color-from-a: 0;
          --background-gradient-color-to-a: 0;
          --background-solid-color-a: 1;
          --background-solid-color-b: 0;
          --background-solid-color-h: 0;
          --background-solid-color-l: 0%;
          --background-solid-color-s: 0%;
          --copyright-font-size: 16px;
          --copyright-font-style: normal;
          --copyright-font-weight: 400;
          --copyright-text-color-a: 1;
          --copyright-text-color-b: 0.27450980392156865;
          --copyright-text-color-h: 0;
          --copyright-text-color-l: 27.450980392156865%;
          --copyright-text-color-s: 0%;
          --link-font-size: 14px;
          --link-font-style: normal;
          --link-font-weight: 400;
          --link-text-color-a: 1;
          --link-text-color-b: 0.6087;
          --link-text-color-h: 0;
          --link-text-color-l: 60.870000000000005%;
          --link-text-color-s: 0%;
          --made-with-font-size: 14px;
          --made-with-font-style: normal;
          --made-with-font-weight: 400;
          --made-with-text-color-a: 1;
          --made-with-text-color-b: 0.27450980392156865;
          --made-with-text-color-h: 0;
          --made-with-text-color-l: 27.450980392156865%;
          --made-with-text-color-s: 0%;
      }
      `}</style>
      <div className="ins-tile__wrap ins-tile__animated">
      </div>
      <div className="ins-tile__links">
        <a
          tabIndex={0}
          href="#"
          target="_blank"
          aria-label="Go back to selsa site in a new tab"
          className="ins-tile__link"
        >
          Selsa Store
        </a>
      </div>
      <div className="ins-tile__copyright ins-tile__link" aria-label="Copy rights">
        <div style={{ color: "white" }}>
          Inspired by Abubeker Haji Hassen --  ስለምንታይ ... እቲ ዘለና‘ከ ዘይነርኢ ... (ዘለና‘ከ ዘይነርኢ...) 
        </div>
        <span className="ins-tile__copyright-text" style={{ color: "white" }}>
          <p>&copy; {new Date().getFullYear()} Selsa. All rights reserved.</p>
        </span>
      </div>
    </footer>
  );
}
