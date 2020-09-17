
class ColorValue
{
    constructor(defaultValue = [0,0,0])
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = [0,0,0];
    }
	
	setValue(valueA)
	{
        this.single = true;
        this.singleValue = valueA;
	}
	
    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        var r = Math.random();

        var x = r * (this.singleValue[0] - this.secondaryValue[0]) + this.secondaryValue[0];
        var y = r * (this.singleValue[1] - this.secondaryValue[1]) + this.secondaryValue[1];
        var z = r * (this.singleValue[2] - this.secondaryValue[2]) + this.secondaryValue[2]; 

        return [Math.round(x), Math.round(y), Math.round(z)];
    }
} 

class Vector3Value
{
    constructor(defaultValue = [0,0,0])
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = [0,0,0];
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        var x = Math.random() * (this.singleValue[0] - this.secondaryValue[0]) + this.secondaryValue[0];
        var y = Math.random() * (this.singleValue[1] - this.secondaryValue[1]) + this.secondaryValue[1];
        var z = Math.random() * (this.singleValue[2] - this.secondaryValue[2]) + this.secondaryValue[2]; 

        return [x, y, z];
    }
} 

class FloatValue
{
    constructor(defaultValue = 0)
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = 0;
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        return Math.random() * (this.secondaryValue - this.singleValue) + this.singleValue;
    }
} 

class BoolValue
{
    constructor(defaultValue = false)
    {
        this.single = true;
        this.singleValue = defaultValue;
        this.secondaryValue = false;
    }

    setRandomLerp(valueA,valueB)
    {
        this.single = false;
        this.singleValue = valueA;
        this.secondaryValue = valueB;
    }

    getValue()
    {
        if(this.single)
            return this.singleValue;
        
        if(Math.random() > 0.5)
            return this.secondaryValue;
        else 
            return this.singleValue;
    }
} 
