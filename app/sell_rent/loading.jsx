import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Loading() {
    return (
        <div className='h-screen w-full sm:bg-img-mob lg:bg-img'>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        </div>
    );
}
