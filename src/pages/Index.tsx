
import MapViewer from "@/components/MapViewer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-map-primary text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Goiânia Tile Viewer</h1>
          <p className="text-sm opacity-80">
            Interactive viewer for Goiânia map tiles
          </p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="h-[calc(100vh-12rem)]">
          <MapViewer />
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Map data provided by{" "}
            <a 
              href="https://tiles-goiania.geo360.com.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-map-primary hover:underline"
            >
              Geo360 Goiânia
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
