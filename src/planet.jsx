import {useState,useEffect} from "react";
import {data} from "./data.js";
import './index.css';

const Planet = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(data);
    }, []);

    return (
        <div>
            {items.map((items, i) =>
                <div className="cardd" key={i}>
                    <p>type: {items.type}</p>
                    <p>Planet: {items.planet}</p>
                    <p>LifeSpan: {items.lifeSpan}</p>
                </div>
            )}
        </div>
    )
}

export default Planet;