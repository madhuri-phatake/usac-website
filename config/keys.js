require("dotenv").config();

const {
    BRANCH_KEY,
    REDIS,
    RZP_KEY,
    RZP_SECRET,
    PTM_RFND_URL,
    PTM_MID,
    PTM_KEY,
    PTM_WEBSITE,
    ALG_app_key,
    ALG_admin_key,
    ALG_search_key,
    ALG_index_name,
    MailChimpStore,
    API_URL
} = process.env;

module.exports = {

    //------------Testing Credentials---------------//
    paytm_mid:              PTM_MID,
    paytm_key:              PTM_KEY,
    paytm_website:          PTM_WEBSITE,
    paytm_refund_api:       PTM_RFND_URL,
    redisHost:              REDIS,
    razorpay_key_id:        RZP_KEY,
    razorpay_key_secret:    RZP_SECRET,
    branch_key:             BRANCH_KEY, 
    ALG_app_key:            ALG_app_key,
    ALG_admin_key:          ALG_admin_key,
    ALG_search_only_key:    ALG_search_key,
    ALG_index_name:         ALG_index_name,
    MailChimpStore :        MailChimpStore,
    api_url:                API_URL,
    sampler_address_id:     ["60c7208626b2443fe4f569db","60c7209a26b2443fe4f569dc"],
    update_vendor:          ["omkarmarkad@accucia.com"],
    update_stock: ["siddheshkasar@accucia.com", "sanjayn@accucia.com"]

    // --------------Production Credentials----------------//

    // paytm_mid: "duBQrC49519408175902",
    // paytm_key: "dHNF7zVwM7@7GU_8",
    // redisHost: "luke-test-redis.bjlo9b.0001.aps1.cache.amazonaws.com",
    // paytm_website: "DEFAULT",
    // paytm_refund_api: 'securegw.paytm.in',

    // razorpay_key_id: "rzp_live_p05ZesYCBTj2Pz",
    // razorpay_key_secret: "t0AN7oE73KSgWmBrYo64SP2M",

    // branch_key: "key_live_fm4p3Zv892jg8kM323GHLaplwsdTkqN6",

    // ALG_app_key: "E226R6FLUL",

    // ALG_admin_key: "a3e074f2b69f0339bed12ac8ba519930",
    
    // ALG_search_only_key: "52ba6e7bd1f86affc0ea924d378b30f0",
    
    // ALG_index_name: "live_products",

    // MailChimpStore : "liveyclstore",

    //  update_vendor: ["virag@youcarelifestyle.com", "nikhil@youcarelifestyle.com", "support@youcarelifestyle.com","onboarding@youcarelifestyle.com"],

    // update_stock: ["virag@youcarelifestyle.com", "nikhil@youcarelifestyle.com", "support@youcarelifestyle.com","onboarding@youcarelifestyle.com","compliance@youcarelifestyle.com"]
} 
