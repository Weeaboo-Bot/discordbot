const { MessageEmbed, MessageAttachment } = require('discord.js');
const Command = require('../../structures/Command');
const Jimp = require('jimp');

module.exports = class TestImgCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test-img',
            aliases: ['test-img'],
            group: 'casino-utils',
            memberName: 'test-img',
            description: 'Testing image embed',
        });
    }

    async run(msg) {
      try {
        const imgs = ['8H', '8S'];
        imgs.forEach(async (img) => {
          await this.resizeImageToDiscordEmbed(this.getImagePath(img), this.getImagePath(img));
        });
        const images = [new MessageAttachment(this.getImagePath(imgs[0])), 
        new MessageAttachment(this.getImagePath(imgs[1]))]
    
        const embed = new MessageEmbed()
          .setTitle('Test')
          .setImage('attachment://8H.png')
          .attachFiles(images);
    
        return msg.reply(embed);
      } catch (error) {
        console.error('Error merging images:', error);
        // Handle the error gracefully, perhaps send an error message to the user
      }
    }
    
    getImagePath(value) {
      return `./assets/images/deck/${value}.png`;
    }
    async resizeImageToDiscordEmbed(imagePath, outputPath) {
      try {
        const maxWidth = 600; // Maximum allowed width for Discord embeds (adjust if needed)
        const maxHeight = 375; // Calculated height based on 1.6:1 aspect ratio
    
        const image = await Jimp.read(imagePath);
    
        let newWidth, newHeight;
    
        // Maintain aspect ratio
        if (image.getWidth() > image.getHeight()) {
          // Landscape image
          newWidth = Math.min(image.getWidth(), maxWidth);
          newHeight = Math.floor(newWidth / 1.6); // Maintain 1.6:1 aspect ratio
        } else {
          // Portrait image
          newHeight = Math.min(image.getHeight(), maxHeight);
          newWidth = Math.floor(newHeight * 1.6);
        }
    
        await image.resize(newWidth, newHeight); // Resize the image
    
        await image.write(outputPath);
    
        console.log(`Image resized and saved to: ${outputPath}`);
      } catch (error) {
        console.error('Error resizing image:', error);
      }
    }
    async mergeImages(imagePath1, imagePath2, mergeMethod, outputPath) {
        try {
          const [image1, image2] = await Promise.all([
            Jimp.read(imagePath1),
            Jimp.read(imagePath2)
          ]);
      
          if (mergeMethod === 'blit') {
            // Overlay using blit
            const mergedImage = image1.clone();
            await mergedImage.blit(image2, 0, 0); // Change coordinates as needed
            await mergedImage.write(outputPath);
          } else if (mergeMethod === 'composite') {
            // Resize and concatenate using composite
            const biggerImage = image1.getWidth() > image2.getWidth() ? image1 : image2;
            const smallerImage = biggerImage === image1 ? image2 : image1;
            await smallerImage.resize(biggerImage.getWidth(), smallerImage.getHeight());
            await biggerImage.composite(smallerImage, 0, 0, { mode: 'HORIZONTAL' }); // Change to 'VERTICAL' for vertical merge
            await biggerImage.write(outputPath);
          } else {
            throw new Error('Invalid merge method. Choose "blit" or "composite".');
          }
        } catch (error) {
          console.error('Error merging images:', error);
        }
      }
      
};
