use wasm_bindgen::prelude::*;
use web_sys::*;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}


#[wasm_bindgen]
pub fn mandelbrot(mut r: f64, mut i: f64, cr: f64, ci: f64, steps: u32) -> u32{
    let mut steps_to_escape: u32 = steps+1;
    let mut rTemp: f64;
    for n in 0..=steps {
        rTemp = r;
        r = r*r-i*i;
        i = 2.0_f64*rTemp*i;
        r += cr;
        i += ci;
        //log(&(r.to_string()+","+&i.to_string()));
        if (r*r+i*i).sqrt() > 2.0_f64 {steps_to_escape = n; break}
    }
    return steps_to_escape
}


