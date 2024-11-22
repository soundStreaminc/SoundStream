import React, { useState, useEffect, useRef } from 'react';
import { getBrowseCategories } from '../services/station.service';

export function Browse() {
    const [categories, setCategories] = useState(null);
    const miniCategories = useRef([]);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const fetchedCategories = await getBrowseCategories();
            console.log('Fetched Categories:', fetchedCategories);
            miniCategories.current = fetchedCategories.map(category => ({
                id: category.id,
                name: category.name,
                image: category.icons && category.icons.length > 0 ? category.icons[0].url : 'https://via.placeholder.com/300',
            }));
            setCategories(miniCategories.current);
        } catch (error) {
            console.error('Error in loadCategories:', error);
        }
    }

    if (!categories) return <span>Loading in progress...</span>;

    return (
        <div className="browse-page">
            <h1 className="browse-header">Browse all</h1>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div className="category-card" key={category.id}>
                        <div className="category-image">
                            <img src={category.image} alt={category.name} />
                        </div>
                        <h2 className="category-name">{category.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
