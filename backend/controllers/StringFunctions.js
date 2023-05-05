class KnuthMorrisPratt
{
	/**
	 * Class constructor
	 *
	 * @param inputString	user string input
	 * @param database		list of strings
	 */
	constructor(inputString, database)
	{
		this.pattern	= inputString;
		this.texts		= database;

		console.log(this.texts);
	}

	/**
	 * Create the preprocess array
	 */
	preprocessPattern()
	{
		// Length of previous longest prefix suffix
		var len = 0;
		var i = 1;

		this.lps[0] = 0;	// 0th index is always 0

		// Calculates lps[i]
		while (i < this.pattern.length)
		{
			if (this.pattern.charAt(i) == this.pattern.charAt(len))
			{
				len++;
				this.lps[i] = len;
				i++;
			}
			else	// this.pattern[i] != this.pattern[len]
			{
				if (len != 0)
				{
					len = this.lps[len - 1];
				}
				else
				{
					this.lps[i] = len;
					i++;
				}
			}
		}
	}

	/**
	 * Main search function to check similarity, will return reply if input exists
	 */
	searchPattern()
	{
		var patternLength = this.pattern.length;

		for (var i = 0; i < this.texts.length; i++)
		{
			var textLength = this.texts[i].Question.length;

			// Initialize lps to hold the longest prefix suffix values for pattern
			this.lps = [];

			// Preprocess the pattern (calculate this.lps array)
			this.preprocessPattern();

			var j = 0;	// Index for this.pattern
			var k = 0;	// Index for this.texts[i]
			while ((textLength - j) >= (patternLength - k))
			{
				if (this.pattern.charAt(k) == this.texts[i].Question.charAt(j))
				{
					j++;
					k++;
				}

				if (k == patternLength)
				{
					// Found pattern at index
					k = this.lps[k - 1];

					console.log('among');

					return this.texts[i].Answer;
				}

				// Mismatch after j matches
				else if (j < textLength && this.pattern.charAt(k) != this.texts[i].Question.charAt(j))
				{
					// Do not match lps[0...lps[j-1]] chars, will match anyway
					if (k != 0)
						k = this.lps[k - 1];
					else
						j++;
				}
			}
		}

		return null;
	}
};

class BoyerMoore
{
	/**
	 * Class constructor
	 *
	 * @param inputString	user input string
	 * @param database		list of strings
	 * @param NO_OF_CHARS	number of chars for the array
	 */
	constructor(inputString, database, NO_OF_CHARS = 512)
	{
		this.pattern		= inputString;
		this.texts			= database;
		
		this.NO_OF_CHARS	= NO_OF_CHARS;
	}

	/**
	 * Find the maximum value
	 *
	 * @param a	First value
	 * @param b Second value
	 */
	max(a, b)
	{
		return (a > b) ? a : b;
	}

	/**
	 * Create the preprocess array
	 */
	badCharHeuristic()
	{
		for (var i = 0; i < this.NO_OF_CHARS; i++)
			this.badChar[i] = -1;

		for (var i = 0; i < this.pattern.length; i++)
			this.badChar[this.pattern[i].charCodeAt(0)] = i;
	}

	/**
	 * Main search function to check similarity, will return reply if input exists
	 */
	searchPattern()
	{
		var patternLength = this.pattern.length;
		
		for (var i = 0; i < this.texts.length; i++)
		{
			var textLength = this.texts[i].Question.length;

			this.badChar = new Array(this.NO_OF_CHARS);

			this.badCharHeuristic();

			var s = 0;
			while (s <= (textLength - patternLength))
			{
				let j = patternLength - 1;
				while (j >= 0 && this.pattern[j] == this.texts[i].Question[s + j])
					j--;

				if (j < 0)
				{
					return this.texts[i].Answer;
				}
				else
				{
					s += this.max(1, j - this.badChar[this.texts[i].Question[s + j].charCodeAt(0)]);
				}
			}
		}

		return null;
	}
};

class LevenstheinDistance
{
	constructor(inputString, database)
	{
		this.pattern	= inputString;
		this.texts		= database;
		this.index		= 0;
		this.distance	= 999999999;
	}

	min(a, b, c)
	{
		if (a <= b && a <= c)
			return a;

		if (b <= a && b <= c)
			return b;

		if (c <= a && c <= b)
			return c;
	}

	calculateLevensthein(patternString, textString, patternLength, textLength)
	{
		// console.log(patternString.slice(0, patternLength), textString.slice(0, textLength), patternLength, textLength);
		if (patternLength == 0)
			return textLength;

		if (textLength == 0)
			return patternLength;

		if (this.dp[patternLength - 1][textLength - 1] != -1)
		{
			// console.log(this.dp);

			return this.dp[patternLength - 1][textLength - 1];
		}

		if (patternString[patternLength - 1] == textString[textLength - 1])
		{
			this.dp[patternLength - 1][textLength - 1] = this.calculateLevensthein(patternString, textString, patternLength - 1, textLength - 1);

			return this.dp[patternLength - 1][textLength - 1];
		}

		this.dp[patternLength - 1][textLength - 1] = 1 + this.min(this.calculateLevensthein(patternString, textString, patternLength, textLength - 1),
																  this.calculateLevensthein(patternString, textString, patternLength - 1, textLength),
																  this.calculateLevensthein(patternString, textString, patternLength - 1, textLength - 1));

		return this.dp[patternLength - 1][textLength - 1];
	}

	initializeLevensthein()
	{
		for (var i = 0; i < this.texts.length; i++)
		{
			this.dp			= new Array(this.pattern.length);

			for (var j = 0; j < this.pattern.length; j++)
			{
				var temp = new Array(this.texts[i].Question.length);

				for (var k = 0; k < this.texts[i].Question.length; k++)
					temp[k] = -1;

				this.dp[j] = temp;
			}

			console.log(i, this.calculateLevensthein(this.pattern, this.texts[i].Question, this.pattern.length, this.texts[i].Question.length))

			if (this.calculateLevensthein(this.pattern, this.texts[i].Question, this.pattern.length, this.texts[i].Question.length) < this.distance)
			{
				this.index = i;
				this.distance = this.calculateLevensthein(this.pattern, this.texts[i].Question, this.pattern.length, this.texts[i].Question.length);
			}
		}

		var denom = (this.texts[this.index].Questionlength > this.pattern.length) ? this.texts[this.index].Question.length : this.pattern.length;

		console.log(1 - (this.distance / denom));
	}
};
