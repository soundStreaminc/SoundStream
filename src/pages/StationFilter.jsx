import React, { useState, useEffect, useRef } from 'react'
import { getBrowseCategories, stationService } from '../services/station.service'
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '../assets/svgs/search.svg?react';
import { useNavigate, useParams } from 'react-router';

export function StationFilter(){
    const params = useParams()
    const [categories, setCategories] = useState(null)
    const miniCategories = useRef([])
    const [searchTerm, setSearchTerm] = useState(stationService.getFilterFromSearchParams(params)); // Declare and initialize searchTerm
    const navigate = useNavigate()

    useEffect(() => {
        loadCategories()
    }, [])

    
    function handleSearchClick() {
        if (!searchTerm.filterText) navigate(`/search/${searchTerm.filterText}`)
    }

    const handleSearchChange = (event) => {
        if (event.target.value)
            navigate(`/search/${event.target.value}`)
        setSearchTerm({ filterText: event.target.value }); // Update searchTerm state when input changes
    }

    const handleOtherButtonClick = () => {
        onClickSearch()
        setActiveButton(''); // Reset active button on other button click
    }

    async function loadCategories() {
        try {
            const fetchedCategories = await getBrowseCategories()
            miniCategories.current = fetchedCategories.map(category => ({
                id: category.id,
                name: category.name,
                image: category.icons && category.icons.length > 0 ? category.icons[0].url : 'https://via.placeholder.com/300',
            }))
            setCategories(miniCategories.current)
        } catch (error) {
            console.error('Error in loadCategories:', error)
        }
    }

    if (!categories) return <span>Loading in progress...</span>

    return (
        <div className="browse-page">
            {/* Search Bar */}
            <div className="search-bar-mobile">
                <Tooltip title="Search" arrow>
                    <div onClick={handleOtherButtonClick}>
                        <SearchIcon className="search-icon" />
                    </div>
                </Tooltip>
                <input
                    type="text" 
                    className='search-bar-input'
                    placeholder="What do you want to play?"
                    value={searchTerm.filterText}  // Bind searchTerm to input
                    onChange={handleSearchChange} // Handle input change
                    onClick={handleSearchClick}
                />
            </div>

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
    )
}