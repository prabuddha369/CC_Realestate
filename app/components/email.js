import * as React from 'react';

export const EmailTemplate = (data) => (
    <div>
        <h1>{data.name},</h1>
        <h1>wants to list a {data.selectedCategory} on CC Realestate for {data.sellRent}ing</h1>
        <h3>Email: {data.email}</h3>
        <h3>Contact: {data.contact}</h3>
        <h3>Property Price Range: Rs {data.minprice} - Rs {data.maxprice}</h3>
    </div>
);
