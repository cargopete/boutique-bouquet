fn main() {
    let password = std::env::args().nth(1).expect("Usage: hash_password <password>");
    let hash = bcrypt::hash(&password, 12).expect("Failed to hash");
    println!("{}", hash);
}
