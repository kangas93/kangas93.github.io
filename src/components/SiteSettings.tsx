import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Container } from "@mui/system";
import { ReactNode } from "react";
import { COLOR_THEMES } from "../constants/constants";

interface Props {
    theme: string,
    setTheme: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

function SiteSettings({ theme, setTheme }: Props) {

    const theme_options = Object.values(COLOR_THEMES);

    return (
        <Container >
            <h3>Change color theme</h3>
            <div className="site-settings__color-menu">
                <FormControl fullWidth className="site-settings__text">
                    <InputLabel className="site-settings__text" id="select-color-theme">Color theme</InputLabel>
                    <Select className="site-settings__text" labelId="select-color-theme"
                        value={theme}
                        label="Color theme"
                        onChange={setTheme}>
                        {
                            theme_options.map((option) => {
                                return (<MenuItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</MenuItem>)

                            })
                        }
                    </Select>
                </FormControl>
            </div>
        </Container>
    )
}

export default SiteSettings;

