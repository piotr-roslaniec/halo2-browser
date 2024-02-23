use halo2_base::gates::circuit::builder::BaseCircuitBuilder;
use halo2_base::gates::flex_gate::{GateChip, GateInstructions};
use halo2_base::halo2_proofs::halo2curves::bn256::Fr;
use halo2_base::halo2_proofs::halo2curves::ff::PrimeField;
use halo2_base::poseidon::hasher::spec::OptimizedPoseidonSpec;
use halo2_base::poseidon::hasher::PoseidonHasher;
pub use halo2_wasm::Halo2Wasm;
use std::{cell::RefCell, rc::Rc};
use std::fmt::Debug;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct MyCircuit {
    // Add whatever other chips you need here
    gate: GateChip<Fr>,
    builder: Rc<RefCell<BaseCircuitBuilder<Fr>>>,
}

#[wasm_bindgen]
impl MyCircuit {
    #[wasm_bindgen(constructor)]
    pub fn new(circuit: &Halo2Wasm) -> Self {
        let gate = GateChip::new();
        MyCircuit {
            gate,
            builder: Rc::clone(&circuit.circuit),
        }
    }

    #[wasm_bindgen()]
    pub fn run(&mut self, iterations: u32) -> String {
        // Replace with your circuit, making sure to use `self.builder`
        let input = (0..iterations as usize).map(|i| {
            self.builder
                .borrow_mut()
                .main(0)
                .load_witness(Fr::from_u128(i as u128))
        });
        let mut poseidon =
            PoseidonHasher::<Fr, 3, 2>::new(OptimizedPoseidonSpec::new::<56, 8, 0>());
        poseidon.initialize_consts(self.builder.borrow_mut().main(0), &self.gate);

        let result = input.reduce(|acc, a| {
            poseidon.hash_fix_len_array(self.builder.borrow_mut().main(0), &self.gate, &[acc, a])
        }).unwrap();

        let result_as_string = format!("{:?}", result);
        result_as_string
    }
}