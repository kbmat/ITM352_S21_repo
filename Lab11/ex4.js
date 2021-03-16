// If string_check is a NonNegInt, then it function will return true
// If the function is true, return reasons why it is a NonNegInt (Not a number/integer or negative value)
function isNonNegInt(string_check, returnErrors=false) {
    errors = []; // Assume no errors at first
    if (Number(string_check) != string_check) errors.push('Not a number!');
    // Check if string is a number value
    if (string_check < 0) errors.push('Negative value!');
    // Check if it is non-negative
    if(parseInt(string_check) != string_check) errors.push('Not an integer!');
    // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}
//define attributes & split values
attributes = "Kimberly;20;MIS";
parts = attributes.split(';');

for(part of parts) {
    console.log(isNonNegInt(part, true));
}