const bootstrap = require("../bootstrap");

test("[Deprecated - faviconByBase64] Measure ignored favicon CPU Time", async () => {
  const start = Date.now();
  const tester = bootstrap("/favicon.ico", "/", "faviconByBase64('ignored')", {
    method: "GET",
  });
  const res = await tester.run();
  return expect(Date.now() - start).toBeLessThanOrEqual(50);
  // toBeGreaterThanOrEqual 大于等于
});

test("[Deprecated - faviconByBase64] Measure common size favicon CPU Time", async () => {
  const start = Date.now();
  const tester = bootstrap(
    "/favicon.ico",
    "/",
    "faviconByBase64('iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAuUlEQVRYhe2YwQ2DQAwEgaQxRCF5pwIayCdlINEGvVBKvic/jAYHsY+dH0J3Gln2ytCv+6dreH237g6WeWofh1skDrEWQVTrmb8OnVgZCHSVaLWsRRDV6h/v8fTh0MWBynyIVstaBFGtUstfh2i1rEUQ1TpYbHKc8hpYixBT/rouRjeLVstaBFEtlvLoEzTv8RzRalmLYC2CtQjWIsSUD8FdSeoc/6T8H9YisMUG7fKV6RGtlrUIolo/mBUnH14fEYMAAAAASUVORK5CYII=')",
    {
      method: "GET",
    }
  );
  const res = await tester.run();
  return expect(Date.now() - start).toBeLessThanOrEqual(50);
});
