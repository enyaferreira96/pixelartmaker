// Pixel Art Maker Project
// Enya Ferreira 2020

// Global variables
let g_DBLCLICK = false;
let g_MOUSEDOWN = false;
const g_DEBUG = false;
const PX_GRID_UPPER_BOUNDS = 20;
const PX_GRID_LOWER_BOUNDS = 0;
const PX_GRID_ERR_MSG = "Error reconstructing pixel grid";

document.addEventListener("DOMContentLoaded", (e_load) => {
    // Get the grid size options
    const params = parse_params_from_query_string();

    // Get pixel grid table and palette table elements
    const px_grid = document.getElementById("pixel_grid");
    const palette = document.getElementById("colour_palette_panel");

    // Restore options from params to page inputs, then build the pixel grid table
    restore_options_from_params(params);
    reconstruct_grid(px_grid, params);

    // Add mouse event listeners to various elements (see functions below)
    document.addEventListener("mouseup", (e) => pixel_release(e));
    px_grid.addEventListener("click", (e) => pixel_click(e));
    px_grid.addEventListener("mousedown", (e) => pixel_press(e));
    px_grid.addEventListener("mouseover", (e) => pixel_slide(e));
    palette.addEventListener("click", (e) => palette_click(e));
    palette.addEventListener("dblclick", (e) => palette_double_click(e));
});

// Iterates over the options, restoring them on the page where possible.
function restore_options_from_params(params) {
    if (params) {
        for (let key in params) {
            if (params.hasOwnProperty(key) && params[key]) {
                const els = document.querySelectorAll(`#${key}`);
                if (els.length > 0)
                    els[0].value = params[key];
            }
        }
    }
}

// Fills e.target with selected colour (provided e.target is a table cell)
function colour_pixel(e) {
    if (e.target.tagName !== "TD")
        return;

    const selected_colour = document.getElementById("selected_colour").value;
    const pixel = e.target;
    pixel.style.backgroundColor = selected_colour;
}

// Mouse-over handler for pixel grid table cells (pixels). Fills cell with selected colour if mouse1 is down.
function pixel_slide(e) {
    if (g_MOUSEDOWN)
        colour_pixel(e);
}

// Click handler for pixel grid table cells (pixels). Fills cell with selected colour.
function pixel_click(e) {
    colour_pixel(e);
}

// Mouse-down handler for pixel grid table cells (pixels). Fills cell with selected colour.
function pixel_press(e) {
    g_MOUSEDOWN = true;
    colour_pixel(e);
}

// Mouse-up handler for the document. Prevents further mouse-over colouring.
function pixel_release(e) {
    g_MOUSEDOWN = false;
}

// Click handler for palette table. Prevents default colorpicker behaviour, instead sets selected colour.
function palette_click(e) {
    if (e.target.tagName !== "INPUT")
        return;

    if (!g_DBLCLICK) {
        e.preventDefault()
        const selected_colour = document.getElementById("selected_colour");
        const new_colour = e.target.value;
        selected_colour.value = new_colour;
    } else {
        g_DBLCLICK = false;
    }
}

// Palette double-click handler. Opens the colorpicker.
function palette_double_click(e) {
    if (e.target.tagName !== "INPUT")
        return;
    g_DBLCLICK = true;
    e.target.click();
}

// Takes a table element and parameters {width: int, height: int} and fills the table with cells for those dimensions.
function reconstruct_grid(px_grid, params) {
    if (!params) {
        console.error(`${PX_GRID_ERR_MSG} #${px_grid.id}: no parameters provided. params=`, params);
        return;
    }
    if (!px_grid || px_grid.tagName !== "TABLE") {
        console.error(`${PX_GRID_ERR_MSG} #${px_grid.id}: table element is undefined. params=`, params);
        return;
    }
    if (params.width > PX_GRID_UPPER_BOUNDS || params.height > PX_GRID_UPPER_BOUNDS || params.width < PX_GRID_LOWER_BOUNDS || params.height < PX_GRID_LOWER_BOUNDS) {
        console.error(`${PX_GRID_ERR_MSG} #${px_grid.id}: grid width and height must be greater than ${PX_GRID_LOWER_BOUNDS} and must not exceed ${PX_GRID_UPPER_BOUNDS}. params=`, params);
        return;
    }

    const width = params.width;
    const height = params.height;

    for (let h = 0; h < height; h++) {
        let html = `<tr class="pixel_row">`;
        for (let w = 0; w < width; w++) {
            const position = `${w},${h}`;
            html += `<td class="pixel" id="${position}">&nbsp;</td>`;
        }
        html += `</tr>`;
        px_grid.innerHTML += html;
    }
}

// Parses a query string e.g. ?id=5&name=Enya to a dictionary
function parse_params_from_query_string(query_string = null) {
    const query_str = query_string ? query_string : window.location.search;
    const query_str_items = query_str.replace("?", "").split("&");
    const params = {};

    query_str_items.forEach((p) => {
        const param = p.split("=");
        params[param[0]] = param[1];
    });

    return params;
}

// For debugging.
function log(o) {
    if (g_DEBUG) console.log(o);
}