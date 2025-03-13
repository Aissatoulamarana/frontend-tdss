import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export function AgenceSearch({ search, onSearch }) {
    const router = useRouter();

    const handleClick = (id) => {
        router.push(paths.dashboard.job.details(id));
    };

    const handleKeyUp = (event) => {
        if (search.state.query) {
            if (event.key === 'Entrée') {
                const selectProduct = search.state.results.filter(
                    (agence) => agence.name === search.state.query
                )[0];

                handleClick(selectProduct.id);
            }
        }
    };

    return (
        <Autocomplete
            sx={{ width: { xs: 1, sm: 260 } }}
            autoHighlight
            popupIcon={null}
            options={search.state.results}
            onInputChange={(event, newValue) => onSearch(newValue)}
            getOptionLabel={(option) => option.name}
            noOptionsText={<SearchNotFound query={search.state.query} />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Recherche..."
                    onKeyUp={handleKeyUp}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
            )}
            renderOption={(props, agence, { inputValue }) => {
                const matches = match(agence.name, inputValue);
                const parts = parse(agence.name, matches);

                return (
                    <Box component="li" {...props} onClick={() => handleClick(agence.id)} key={agence.id}>
                        <div>
                            {parts.map((part, index) => (
                                <Typography
                                    key={index}
                                    component="span"
                                    color={part.highlight ? 'primary' : 'textPrimary'}
                                    sx={{
                                        typography: 'body2',
                                        fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                                    }}
                                >
                                    {part.text}
                                </Typography>
                            ))}
                        </div>
                    </Box>
                );
            }}
        />
    );
}
