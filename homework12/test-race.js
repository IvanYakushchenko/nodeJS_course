(async () => {
  const body = JSON.stringify({ code: 'SPRING30', percent: 30 });
  const headers = { 'Content-Type': 'application/json' };

  const promises = Array.from({ length: 5 }).map((_, i) =>
    fetch('http://localhost:3000/discounts', {
      method: 'POST',
      headers,
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`[Response ${i + 1}]`, data);
        return data;
      })
      .catch((err) => {
        console.error(`[Error ${i + 1}]`, err);
        throw err;
      })
  );

  const results = await Promise.all(promises);
  console.log('--- All results ---');
  console.log(results);
})();