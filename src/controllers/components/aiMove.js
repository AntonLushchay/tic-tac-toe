async function aiMove(board, difficulty) {
	let model;
	let temperature;
	if (difficulty === 'easy') {
		model = 'gemini-2.5-flash-lite-preview-06-17';
		temperature = 2.0;
	} else if (difficulty === 'medium') {
		model = 'gemini-2.5-flash';
		temperature = 1.0;
	} else if (difficulty === 'hard') {
		model = 'gemini-2.5-pro';
		temperature = 0.5;
	}

	const API_KEY = process.env.GEMINI_API_KEY;

	const prompt = `You are playing tic-tac-toe as 'O'.
		Board state (positions 0-8): ${board.map((cell, i) => `${i}:${cell || 'empty'}`).join(', ')}
		Return only the position number (0-8) for your move. You must choose a valid position that is empty.`;

	console.log(`AI Model: ${model}`);

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
			{
				method: 'POST',
				headers: {
					'x-goog-api-key': API_KEY,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
					generationConfig: {
						temperature: temperature,
					},
				}),
			},
		);

		const data = await response.json();
		const aiResponse = data.candidates[0].content.parts[0].text;
		const move = parseInt(aiResponse, 10);

		if (board[move] !== null) {
			console.warn(
				'AI returned an invalid move. Choosing a random empty cell.',
			);
			const emptyCells = board
				.map((cell, index) => (cell === null ? index : null))
				.filter((index) => index !== null);
			if (emptyCells.length > 0) {
				return emptyCells[
					Math.floor(Math.random() * emptyCells.length)
				];
			}
		}

		return move;
	} catch (error) {
		console.error('Error during AI move:', error);
		console.warn(
			'AI returned an invalid move. Choosing a random empty cell.',
		);
		const emptyCells = board
			.map((cell, index) => (cell === null ? index : null))
			.filter((index) => index !== null);
		if (emptyCells.length > 0) {
			return emptyCells[Math.floor(Math.random() * emptyCells.length)];
		}
	}
}

export default aiMove;
