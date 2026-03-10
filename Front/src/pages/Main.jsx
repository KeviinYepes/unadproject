import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Main() {

  return (
    <div className="flex h-screen w-full font-display bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
      </div>
    </div>
  );
}