/*
#[test_only]
module fate3ai::fate3ai_tests;
// uncomment this line to import the module
// use fate3ai::fate3ai;

const ENotImplemented: u64 = 0;

#[test]
fun test_fate3ai() {
    // pass
}

#[test, expected_failure(abort_code = ::fate3ai::fate3ai_tests::ENotImplemented)]
fun test_fate3ai_fail() {
    abort ENotImplemented
}
*/
#[test_only]
module fate3ai::testtoken_tests;

use std::string;
use fate3ai::fate::{Self,AppTokenCap};
use fate3ai::profile::{Self, Profile};
use sui::test_scenario::{Self};

#[test]
fun test_create_profile(){

    let user = @0xa;
    let mut scenario_val = test_scenario::begin(user);
    let scenario = &mut scenario_val;

    fate::init_for_testing_in_tests(test_scenario::ctx(scenario));
    test_scenario::next_tx(scenario,user);
    let handle = string::utf8(b"test");
    {
        profile::mint(handle,test_scenario::ctx(scenario));
    };

    test_scenario::next_tx(scenario,user);

    {
        let mut appcap = test_scenario::take_shared<AppTokenCap>(scenario);
        let mut profile = test_scenario::take_from_sender<Profile>(scenario);
        let ctx = test_scenario::ctx(scenario);
        ctx.increment_epoch_timestamp(1000);
        fate::signin2earn(&mut profile,&mut appcap, ctx);
        test_scenario::return_shared(appcap);
        test_scenario::return_to_sender(scenario,profile);
    };

    test_scenario::next_tx(scenario,user);
    {
        let profile = test_scenario::take_from_sender<Profile>(scenario);
        assert!(profile::points(&profile) > 0);
        test_scenario::return_to_sender(scenario,profile);

    };


    test_scenario::end(scenario_val);

}