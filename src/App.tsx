import './App.css';
import { GridCustomObserver } from './components/GridCustomObserver';
import { GridLoadOnScroll } from './components/GridLoadOnScroll';

function App() {
  return (
    <div className='App'>
      <GridCustomObserver />
      {/* <GridLoadOnScroll /> */}
    </div>
  );
}

export default App;
