export default function Footer() {
  return (
    <footer className="py-5 border-top border-theme bg-theme-secondary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <p className="mb-4 text-theme">
              © 2025 ERer. All rights reserved.
            </p>
            <div className="d-flex justify-content-center gap-4">
              <a
                href="#"
                className="text-decoration-none text-theme hover-underline"
              >
                개인 정보 처리 방침
              </a>
              <a
                href="#"
                className="text-decoration-none text-theme hover-underline"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
