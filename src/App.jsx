import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'Inglês' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' },
  { code: 'de', name: 'Alemão' },
  { code: 'it', name: 'Italiano' },
];

function App() {
  const [sourceLang, setSourceLang] = useState('pt');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  // useEffect com debounce para traduzir automaticamente
  useEffect(() => {
    const handleTranslate = async () => {
      if (!sourceText.trim()) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            sourceText
          )}&langpair=${sourceLang}|${targetLang}`
        );
        const data = await response.json();
        setTranslatedText(data.responseData.translatedText);
      } catch (error) {
        console.error('Erro na tradução:', error);
        setTranslatedText('Erro na tradução');
      }
      setIsLoading(false);
    };

    let delay;
    if (sourceText) {
      delay = setTimeout(() => {
        handleTranslate();
      }, 500);
    }
    return () => clearTimeout(delay);
  }, [sourceText, sourceLang, targetLang]);

  // Função para inverter idiomas
  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-bold">Tradutor Teste</h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          {/* Top controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={swapLanguages}
              className="p-2 rounded-full hover:bg-gray-100 outline-none"
            >
              <svg
                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Text areas */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Digite seu texto..."
                className="w-full h-40 text-lg text-textColor bg-transparent resize-none border-none outline-none"
              ></textarea>
            </div>

            <div className="p-4 relative bg-secondaryBackground border-l border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                ) : (
                  <p className="text-lg text-textColor">{translatedText}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-headerColor">
          &copy; {new Date().getFullYear()} Tradutor
        </div>
      </footer>
    </div>
  );
}

export default App;
