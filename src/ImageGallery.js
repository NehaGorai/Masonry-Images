// src/ImageGallery.js
import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import './ImageGallery.css'; // Create this file for custom styling

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`https://api.unsplash.com/photos?page=${page}&per_page=30`, {
                    headers: {
                        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                });
                setImages(prevImages => [...prevImages, ...response.data]);
            } catch (error) {
                console.error('Error fetching the images', error);
                setError('Failed to fetch images. Please try again later.');
            }
        };

        fetchImages();
    }, [page, UNSPLASH_ACCESS_KEY]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="masonry-container">
            {images.length === 0 ? (
                <div className="loading">Loading images...</div>
            ) : (
                <>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {images.map((image) => (
                            <div key={image.id} className="image-item">
                                <img src={image.urls.regular} alt={image.alt_description} className="image" />
                            </div>
                        ))}
                    </Masonry>
                    <button onClick={loadMore} className="load-more">Load More</button>
                </>
            )}
        </div>
    );
};

export default ImageGallery;
