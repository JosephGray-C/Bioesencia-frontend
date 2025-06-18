//Imports 

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      Bioesencia &copy; {year}
    </footer>
  );
}
// This is a simple footer component that displays the current year and the name "Bioesencia".