export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-8">
      <p className="text-sm">
        © {new Date().getFullYear()} Based Scrabble
      </p>
    </footer>
  );
}
