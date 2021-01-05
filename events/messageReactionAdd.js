module.exports = async (client, messageReaction, user) => {
	if(messageReaction.message.author.id !== client.user.id) return undefined;
	if(user.bot) return undefined;
	if(messageReaction.emoji == '🎴') {

		setTimeout(async function() {
			await messageReaction.message.edit('5⃣');

			setTimeout(async function() {
				await messageReaction.message.edit('4⃣');

				setTimeout(async function() {
					await messageReaction.message.edit('3⃣');

					setTimeout(async function() {
						await messageReaction.message.edit('2⃣');

						setTimeout(async function() {
							await messageReaction.message.edit('1⃣');

							// eslint-disable-next-line max-nested-callbacks
							setTimeout(async function() {
								await messageReaction.message.delete();
							}, 1000);

						}, 1000);

					}, 1000);

				}, 1000);

			}, 1000);

		}, 1000);

		return null;
	}

	return null;
};
