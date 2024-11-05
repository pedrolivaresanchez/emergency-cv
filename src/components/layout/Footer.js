const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
            Web creada por personas voluntarias,{' '}
            <span className="block sm:inline">independiente de cualquier organismo.</span>
          </p>
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Emergency CV</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
