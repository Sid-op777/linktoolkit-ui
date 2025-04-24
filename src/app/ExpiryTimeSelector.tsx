'use client';

import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';


interface ExpiryTimeSelectorProps {
    onExpiryChange: (expiry: string) => void;
    expiryType: 'duration' | 'date';
    setExpiryType: (type: 'duration' | 'date') => void;
}

const ExpiryTimeSelector: React.FC<ExpiryTimeSelectorProps> = ({ onExpiryChange, expiryType, setExpiryType }) => {
    const [duration, setDuration] = useState({ years: 0, months: 1, days: 0 }); // Default to 1 month
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showExpiryOptions, setShowExpiryOptions] = useState(false);

    const handleExpiryTypeChange = (type: 'duration' | 'date') => {
        setExpiryType(type);
        // Reset expiry value when the type changes
        if (type === 'duration') {
            onExpiryChange(toISO8601(duration));
        } else {
            onExpiryChange(selectedDate ? selectedDate.toISOString() : '');
        }
    };

    const handleDurationChange = (field: 'years' | 'months' | 'days', value: number) => {
        const newDuration = { ...duration, [field]: value };
        setDuration(newDuration);
        onExpiryChange(toISO8601(newDuration));
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        onExpiryChange(date ? date.toISOString() : '');
    };

    const toISO8601 = (duration: { years: number; months: number; days: number }): string => {
        let isoString = 'P';
        isoString += duration.years ? `${duration.years}Y` : '';
        isoString += duration.months ? `${duration.months}M` : '';
        isoString += duration.days ? `${duration.days}D` : '';
        return isoString === 'P' ? 'P1M' : isoString; // Default to P1M if empty
    };

    return (
        <div>
            {/* Toggle to Show Expiry Options */}
            {!showExpiryOptions ? (
                <Button
                    onClick={() => setShowExpiryOptions(true)}
                    variant="contained"
                    sx={{
                        marginBottom: '16px',
                        backgroundColor: '#54A2FC', // your custom blue
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#3c8be0', // slightly darker on hover
                        },
                      }}
                >
                    Set URL Expiry (Default: 1 Month)
                </Button>
            ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                    {/* Toggle Buttons for Duration/Date */}
                    <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        onClick={() => handleExpiryTypeChange('duration')}
                        sx={{
                        flex: 1,
                        backgroundColor: expiryType === 'duration' ? '#54A2FC' : '#f0f0f0',
                        color: expiryType === 'duration' ? 'white' : '#333',
                        border: expiryType === 'duration' ? 'none' : '1px solid #ccc',
                        '&:hover': {
                            backgroundColor: expiryType === 'duration' ? '#3c8be0' : '#e0e0e0',
                        },
                        }}
                    >
                        Duration
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleExpiryTypeChange('date')}
                        sx={{
                        flex: 1,
                        backgroundColor: expiryType === 'date' ? '#54A2FC' : '#f0f0f0',
                        color: expiryType === 'date' ? 'white' : '#333',
                        border: expiryType === 'date' ? 'none' : '1px solid #ccc',
                        '&:hover': {
                            backgroundColor: expiryType === 'date' ? '#3c8be0' : '#e0e0e0',
                        },
                        }}
                    >
                        Date
                    </Button>
                    </Box>

                    {/* Duration or Date Picker */}
                    {expiryType === 'duration' && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {/* Year Input */}
                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Years</InputLabel>
                                <Select
                                    value={duration.years}
                                    onChange={(e) => handleDurationChange('years', e.target.value as number)}
                                    label="Years"
                                    sx={{
                                        bgcolor: 'background.paper',
                                        color: 'text.primary'
                                      }}
                                >
                                    {[...Array(6).keys()].map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i} year{i === 1 ? '' : 's'}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Month Input */}
                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Months</InputLabel>
                                <Select
                                    value={duration.months}
                                    onChange={(e) => handleDurationChange('months', e.target.value as number)}
                                    label="Months"
                                    
                                    sx={{
                                        bgcolor: 'background.paper',
                                        color: 'text.primary'
                                      }}
                                >
                                    {[...Array(12).keys()].map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i} month{(i) === 1 ? '' : 's'}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Day Input */}
                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Days</InputLabel>
                                <Select
                                    value={duration.days}
                                    onChange={(e) => handleDurationChange('days', e.target.value as number)}
                                    label="Days"
                                    sx={{
                                        bgcolor: 'background.paper',
                                        color: 'text.primary'
                                      }}
                                >
                                    {[...Array(31).keys()].map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i} day{(i === 1 ? '' : 's')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                    {expiryType === 'date' && (
                        <Box>
                            {/* Date Picker Controls */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    minDate={new Date()} // Disable past dates
                                    sx={{
                                        bgcolor: 'background.paper',
                                        color: 'text.primary',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        p: 1
                                      }}
                                />
                            </LocalizationProvider>
                        </Box>
                    )}
                </Box>
            )}
        </div>
    );
};

export default ExpiryTimeSelector;

