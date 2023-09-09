/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type RelationshipType = 0 | 1 | 2 | 3 | 4 | 5;

export interface AgentProfile {
  pk?: string;
  first_name: string;
  last_name: string;
  age?: number;
  occupation?: string;
  gender?: string;
  gender_pronoun?: string;
  public_info?: string;
  big_five?: string;
  moral_values?: string[];
  schwartz_personal_values?: string[];
  personality_and_values?: string;
  decision_making_style?: string;
  secret?: string;
  model_id?: string;
  [k: string]: unknown;
}
export interface AnnotationForEpisode {
  pk?: string;
  /**
   * the pk id of episode log
   */
  episode: string;
  annotator_id: string;
  scores_for_each_turn: number[][];
  [k: string]: unknown;
}
export interface Annotator {
  pk?: string;
  name: string;
  email: string;
  [k: string]: unknown;
}
export interface EnvAgentComboStorage {
  pk?: string;
  env_id?: string;
  agent_ids?: string[];
  [k: string]: unknown;
}
export interface EnvironmentProfile {
  pk?: string;
  /**
   * The codename of the environment
   */
  codename?: string;
  /**
   * The source of the environment
   */
  source?: string;
  /**
   * A concrete scenario of where the social interaction takes place, the scenario should have two agents (agent1 and agent2), and you should illustrate the relationship between the two agents, and for what purpose agent1 is interacting with agent2. Please avoid mentioning specific names and occupations in the scenario and keep all the mentions gender-neutral. Also avoid generating scenarios that requires childrend (below 18) or elderly (above 70) to be involved.
   */
  scenario?: string;
  /**
   * The social goals of each agent, which could include <extra_info>...</extra_info>, <clarification_hint>...</clarification_hint>, and <strategy_hint>...</strategy_hint> to help the agent achieve the goal. Avoid providing too specific strategy hint, try to be as abstract as possible. For example, use 'you can provide financial benefits to achieve your goal' instead of 'you can buy him a boba tea to achieve your goal.'
   */
  agent_goals?: string[];
  /**
   * The relationship between the two agents, choose from: stranger, know_by_name, acquaintance, friend, romantic_relationship, family_member. Do not make up a relationship, but choose from the list, 0 means stranger, 1 means know_by_name, 2 means acquaintance, 3 means friend, 4 means romantic_relationship, 5 means family_member
   */
  relationship?: RelationshipType;
  /**
   * The age constraint of the environment, a list of tuples, each tuple is a range of age, e.g., '[(18, 25), (30, 40)]' means the environment is only available to agent one between 18 and 25, and agent two between 30 and 40
   */
  age_constraint?: string;
  /**
   * The occupation constraint of the environment, a list of lists, each list is a list of occupations, e.g., '[['student', 'teacher'], ['doctor', 'nurse']]' means the environment is only available to agent one if agent one is a student or a teacher, and agent two is a doctor or a nurse
   */
  occupation_constraint?: string;
  agent_constraint?: string[][];
  [k: string]: unknown;
}
export interface EpisodeLog {
  pk?: string;
  environment: string;
  agents: string[];
  tag?: string;
  models?: string[];
  messages: [string, string, string][][];
  reasoning: string;
  rewards: (
    | [
        number,
        {
          [k: string]: number;
        }
      ]
    | number
  )[];
  rewards_prompt: string;
  [k: string]: unknown;
}
export interface MessageTransaction {
  pk?: string;
  timestamp_str: string;
  sender: string;
  message: string;
  [k: string]: unknown;
}
export interface RelationshipProfile {
  pk?: string;
  agent_1_id: string;
  agent_2_id: string;
  /**
   * 0 means stranger, 1 means know_by_name, 2 means acquaintance, 3 means friend, 4 means romantic_relationship, 5 means family_member
   */
  relationship: RelationshipType;
  background_story?: string;
  [k: string]: unknown;
}
export interface SessionTransaction {
  pk?: string;
  expire_time?: number;
  session_id: string;
  client_id: string;
  server_id: string;
  client_action_lock?: string;
  /**
   * List of messages in this session.
   *     Each message is a tuple of (timestamp, sender_id, message)
   *     The message list should be sorted by timestamp.
   *
   */
  message_list: MessageTransaction[];
  [k: string]: unknown;
}
export interface JsonModel {
  pk?: string;
  [k: string]: unknown;
}
export interface AutoExpireMixin {
  pk?: string;
  expire_time?: number;
  [k: string]: unknown;
}
export interface HashModel {
  pk?: string;
  [k: string]: unknown;
}
/**
 * An interface for messages.
 * There is only one required method: to_natural_language
 */
export interface Message {}
export interface EmbeddedJsonModel {
  pk?: string;
  [k: string]: unknown;
}
