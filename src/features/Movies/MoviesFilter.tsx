import { FilterAltOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  TextField,
  debounce,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { KeywordItem, client } from "../../api/tmdb";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../hooks";

export interface Filters {
  keywords: KeywordItem[];
  genres: number[];
}

interface MoviesFilterProps {
  onApply(filters: Filters): void;
}

function MoviesFilter({ onApply }: MoviesFilterProps) {
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [keywordsOptions, setKeywordsOptions] = useState<KeywordItem[]>([]);

  const { handleSubmit, control, formState } = useForm<Filters>({
    defaultValues: {
      keywords: [],
      genres: [],
    },
  });

  const genres = useAppSelector((state) => state.movies.genres);

  const fetchKeywordsOptions = async (query: string) => {
    if (query) {
      setKeywordsLoading(true);
      const options = await client.getKeywords(query);
      setKeywordsLoading(false);

      setKeywordsOptions(options);
    } else {
      setKeywordsOptions([]);
    }
  };

  const debouncedfetchKeywordsOptions = useMemo(
    () => debounce(fetchKeywordsOptions, 1000),
    []
  );

  return (
    <Paper sx={{ m: 2, p: 0.5 }}>
      <form onSubmit={handleSubmit(onApply)}>
        <FormControl
          component="fieldset"
          variant="standard"
          sx={{ m: 2, display: "block" }}
        >
          <Controller
            name="keywords"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                disablePortal
                loading={keywordsLoading}
                options={keywordsOptions}
                filterOptions={(x) => x}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => onChange(value)}
                value={value}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Keywords" />
                )}
                onInputChange={(_, value) =>
                  debouncedfetchKeywordsOptions(value)
                }
              />
            )}
          />
        </FormControl>

        <FormControl
          component="fieldset"
          variant="standard"
          sx={{ m: 2, display: "block" }}
        >
          <FormLabel component="legend">Genres</FormLabel>
          <FormGroup sx={{ maxHeight: 500 }}>
            <Controller
              name="genres"
              control={control}
              render={({ field }) => (
                <>
                  {genres.map((genre) => (
                    <FormControlLabel
                      key={genre.id}
                      control={
                        <Checkbox
                          value={genre.id}
                          checked={field.value.includes(genre.id)}
                          onChange={(event, checked) => {
                            const valueNumber = Number(event.target.value);
                            if (checked) {
                              field.onChange([...field.value, valueNumber]);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (value) => value !== valueNumber
                                )
                              );
                            }
                          }}
                        />
                      }
                      label={genre.name}
                    />
                  ))}
                </>
              )}
            />
          </FormGroup>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          startIcon={<FilterAltOutlined />}
          sx={{ m: 2 }}
          disabled={!formState.isDirty}
        >
          Apply filter
        </Button>
      </form>
    </Paper>
  );
}

export default MoviesFilter;
