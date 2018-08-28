
// Block extractor

const fs = require('fs');
const path = require('path');

module.exports = ({ blocks, items }, outputDirectory) => new Promise((resolve, reject) => {

	const extracted = [];

	// Extract data
	for(let name in blocks.block) {

		const block = blocks.block[name];

		const blockData = {
			id: block.numeric_id,
			textId: block.text_id,
			displayName: block.display_name,
			name: block.text_id,
			hardness: block.hardness,
		}

		// Get block hardness

			if(!blockData.hardness) blockData.hardness = 0;

		// TODO: Get block emitLight, filterLight, boundingBox and transparent

		// Get block states

			const states = []
			if (block.states) {

				for (var index in block.states) {
					
					let state = block.states[index]
					states.push({
						name: state.name,
						type: state.type,
						values: state.values,
						num_values: state.num_values
					})

				}

			}

			blockData.states = states;

		// Get block drops

			let drops = null

			// Remove any `wall_` from block id (skeleton_skull item has two blocks, skeleton_skull and skeleton_wall_skull)
			let idParsed = block.text_id.replace('wall_', '')
			if (items.item[idParsed]) {
				drops = items.item[idParsed].text_id
			}

			// Check if the block is a flower pot with a flower in it
			if (!drops && idParsed.startsWith('potted')) {
				drops = [
					'flower_pot',
					idParsed.substring(7)
				]
			}

			// Manually check for other possible blocks
			if (!drops) {

				drops = [];

				if (idParsed === 'potatoes') drops.push('potato');
				if (idParsed === 'redstone_wire') drops.push('redstone');
				if (idParsed === 'tripwire') drops.push('string');
				if (idParsed === 'melon_stem') drops.push('melon_seeds' );
				if (idParsed === 'pumpkin_stem') drops.push('pumpkin_seeds');
				if (idParsed === 'beetroots') drops.push('beetroot');
				if (idParsed === 'carrots') drops.push('carrot');
				if (idParsed === 'cocoa') drops.push('cocoa_beans');
				if (idParsed === 'kelp_plant') drops.push('kelp');
				if (idParsed === 'tall_seagrass') drops.push('seagrass');

			}

			blockData.drops = drops;

		// Get block diggable

			let diggable = true;

			if(block.hardness === -1.0) diggable = false;
			if(block.text_id === 'water' || block.text_id === 'lava') diggable = false; 

			blockData.diggable = diggable;

		extracted.push(blockData)

	}
	
	// Sort data
	extracted.sort((a, b) => (a.id - b.id))

	try {
		fs.writeFileSync(path.join(outputDirectory, 'blocks.json'), JSON.stringify(extracted, null, 2))
		resolve();
	} catch(e) {
		reject(e)
	}

})