/*eg  基础牌阵
base_promt: 说明：根据发送的卡牌 和 问题给出占卜解释，使用中文回复。
card_metad:卡牌:[Fool,Magician,Priestess]. 
question:问题:明天外出运势如何？
*/
export const base_prompt = "说明：根据发送的卡牌 和 问题给出占卜解释，/n"
export const base_prompt_en = "Note: Given a divination explanation based on the sent card and problem.English reply";
export const card_metad = "卡牌:[Fool,Magician,Priestess]. ";
export const question = "问题:";
export const last_prompts = base_prompt + card_metad + question;

/*
直指核心牌陣
適合問題探索 & 切中要害
直指核心牌陣專門用於占卜問題的核心因素，特別適用於具體問題遇到瓶頸時尋求突破。這個牌陣能幫助我們清楚地看到問題的根本所在，進而做出正確的決策。它有著極強的問題解決能力，可以快速找到問題的癥結。如果你對某個問題感到糾結不定，這個牌陣可以幫你快速理清思路，找到解決方案。
说明：根据发送的卡牌 和 问题给出占卜解释，使用中文回复。
卡牌:[高塔 (正位),戰車 (逆位),權杖九 (正位),權杖皇后 (逆位)]
问题:是否放弃躺平？
*/ 

export const second_prompt = "直指核心牌陣 適合問題探索 & 切中要害 \n 直指核心牌陣專門用於占卜問題的核心因素，特別適用於具體問題遇到瓶頸時尋求突破。\n 這個牌陣能幫助我們清楚地看到問題的根本所在，進而做出正確的決策。它有著極強的問題解決能力，\n可以快速找到問題的癥結。如果你對某個問題感到糾結不定，這個牌陣可以幫你快速理清思路，找到解決方案。\n 说明：根据发送的卡牌 和 问题给出占卜解释。"
