test("Conhecer as principais assertivas do jest", () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test("Saber trabalhar com objetos", () => {
  const obj = { name: "John", mail: "john@mail.com" };
  expect(obj).toHaveProperty("name");
  expect(obj.mail).toBe("john@mail.com");
  const obj2 = { name: "Jane", mail: "jane@mail.com" };
  expect(obj).not.toEqual(obj2);
});
