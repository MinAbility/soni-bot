import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from 'discord.js';
import { responses } from '../responses/8ball.json';
import type { Command } from '../types/Command';
import type Client from '../util/Client';
import {CONSTANTS} from '../util/config';
import Logger from '../util/Logger';

// noinspection JSUnusedGlobalSymbols
/**
 * The 8ball command
 *
 * @author Soni
 * @since 6.0.0
 * @see {@link Command}
 */
export default class EightBall implements Command
{
    name = '8ball';
    description = 'For help with daily decisions';
    client: Client;
    logger = new Logger(EightBall.name);
    category: 'fun' = 'fun';

    /**
     * Creates a new 8ball command
     *
     * @param {Client} client The Client the command is attached to
     *
     * @author Soni
     * @since 6.0.0
     * @see {@link Client}
     */
    constructor(client: Client)
    {
        this.client = client;
    }

    /**
     * Executes the command
     *
     * @param {ChatInputCommandInteraction<"cached">} i The command interaction
     * @returns {Promise<Message<boolean>>} The reply sent by the bot
     *
     * @author Soni
     * @since 6.0.0
     * @see {@link ChatInputCommandInteraction}
     */
    async execute(i: ChatInputCommandInteraction<'cached'>): Promise<Message>
    {
        const question = i.options.getString('question', true);

        // Make sure content is within a reasonable length limit
        if (question.length > 1000) return await i.editReply({ embeds: [
            this.client.defaultEmbed()
                .setColor(CONSTANTS.COLORS.warning)
                .setTitle('An error occurred')
                .addFields([
                    {
                        name: 'Invalid Question',
                        value: 'The question cannot exceed 1000 characters'
                    }
                ])
        ] });

        return await i.editReply({ embeds: [
            this.client.defaultEmbed()
                .setTitle('8ball result')
                .addFields([
                    {
                        name: "Question",
                        value: question
                    },
                    {
                        name: "Answer",
                        value: responses[this.client.randomNumber(0, responses.length)]
                    }
                ])
        ] });
    }

    /**
     * The slash command builder for this command interaction.
     *
     * @returns {Promise<SlashCommandBuilder>} The slash command builder for this command interaction.
     */
    async slashCommand(): Promise<SlashCommandBuilder>
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option => option.setName('question')
                .setDescription('The question to evaluate')
                .setRequired(true)) as SlashCommandBuilder;
    }
}
