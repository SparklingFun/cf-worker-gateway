const tester = require("../tester");

test('Measure ignored favicon CPU Time', () => {
    const start = Date.now();
    return tester({
        faviconBase64: "ignored"
    }, "/favicon.ico", {
        method: 'GET'
    }).then(res => {
        expect(Date.now() - start).toBeLessThanOrEqual(10);
        // toBeGreaterThanOrEqual 大于等于
    })
});

test('Measure common size favicon CPU Time', () => {
    const start = Date.now();
    return tester({
        faviconBase64: "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAuUlEQVRYhe2YwQ2DQAwEgaQxRCF5pwIayCdlINEGvVBKvic/jAYHsY+dH0J3Gln2ytCv+6dreH237g6WeWofh1skDrEWQVTrmb8OnVgZCHSVaLWsRRDV6h/v8fTh0MWBynyIVstaBFGtUstfh2i1rEUQ1TpYbHKc8hpYixBT/rouRjeLVstaBFEtlvLoEzTv8RzRalmLYC2CtQjWIsSUD8FdSeoc/6T8H9YisMUG7fKV6RGtlrUIolo/mBUnH14fEYMAAAAASUVORK5CYII="
    }, "/favicon.ico", {
        method: 'GET'
    }).then(res => {
        expect(Date.now() - start).toBeLessThanOrEqual(10);
    })
});