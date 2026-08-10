import './index.css';
import { createRoot } from 'react-dom/client';
import { InteractiveFolderGallery } from './components/ui/interactive-folder-gallery';

import img1 from "../photos/concerts/loverave2.jpg";
import img2 from "../photos/concerts/loverave3.jpg";
import img3 from "../photos/concerts/loverave4.jpg";
import img4 from "../photos/concerts/loverave1.jpg";
import img5 from "../photos/concerts/loverave8.jpg";

const photos = [
  { id: 1, image: img1 },
  { id: 2, image: img2 },
  { id: 3, image: img3 },
  { id: 4, image: img4 },
  { id: 5, image: img5 }
];

const container = document.getElementById('react-folder-gallery-root');
if (container) {
  const root = createRoot(container);
  root.render(<InteractiveFolderGallery photos={photos} />);
}
