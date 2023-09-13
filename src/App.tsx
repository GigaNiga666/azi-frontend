import React from 'react';
import DescPage from "./pages/DescPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/:id' element={<DescPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;