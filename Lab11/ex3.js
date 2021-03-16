// defining variable attributes & split values
attributes = "Kimberly;20;MIS";
parts = attributes.split(';')
console.log(parts);
// assign age and name a value
age = 20;
name = "Kimberly";

attributes = name + ";" + age + ";" + (age + 0.5) + ";" + (0.5 - age);
pieces = attributes.split(';');
for (i in parts) {
    parts[i] = `${typeof parts[i]} ${parts[i]}}`;
}

// invert pieces back into string
console.log(parts.join(","));
