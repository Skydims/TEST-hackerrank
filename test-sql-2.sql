SELECT pt.stock_code
FROM price_today pt
JOIN price_tomorrow ptm ON pt.stock_code = ptm.stock_code
WHERE ptm.price > pt.price
ORDER BY pt.stock_code;
