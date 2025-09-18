// // InstagramFeed.jsx
// import React from "react";
// import '../Components/Instagram.css'



// const posts = [
//   {
//     id: 1,
//     username: "biker_sinan",
//     image: "https://img.atlasobscura.com/xhLcz3vKMss49fNdn_64fv7qqztGjpd77fWvg-Y0n1w/rt:fit/w:1280/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL2Fzc2V0/cy9lMDU1ZGEwOTE0/Nzc0NzdhNTdfVGFu/YSBMdWNpeWEgSm9q/aSB3aGVlbGllIGFn/YWluIENST1AuanBn.jpg",
//     caption: "Exploring the mountains on my new ride! 🏍️",
//   },
//   {
//     id: 2,
//     username: "motorfan123",
//     image: "https://img.atlasobscura.com/xhLcz3vKMss49fNdn_64fv7qqztGjpd77fWvg-Y0n1w/rt:fit/w:1280/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL2Fzc2V0/cy9lMDU1ZGEwOTE0/Nzc0NzdhNTdfVGFu/YSBMdWNpeWEgSm9q/aSB3aGVlbGllIGFn/YWluIENST1AuanBn.jpg",
//     caption: "Sunset rides are the best 🌅",
//   },
//   {
//     id: 3,
//     username: "speed_demon",
//     image: "https://img.atlasobscura.com/xhLcz3vKMss49fNdn_64fv7qqztGjpd77fWvg-Y0n1w/rt:fit/w:1280/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL2Fzc2V0/cy9lMDU1ZGEwOTE0/Nzc0NzdhNTdfVGFu/YSBMdWNpeWEgSm9q/aSB3aGVlbGllIGFn/YWluIENST1AuanBn.jpg",
//     caption: "Nothing beats the thrill of the open road!",
//   },
// ];

// function InstagramFeed() {
//   return (
//     <div className="instagram-feed">
//       {posts.map((post) => (
//         <div className="instagram-card" key={post.id}>
//           {/* Header */}
//           <div className="card-header">
//             <i className="fa-brands fa-instagram instagram-logo"></i>
//             <span className="username">{post.username}</span>
//           </div>

//           {/* Main Image */}
//           <div className="card-image">
//             <img src={post.image} alt={post.username} />
//           </div>

//           {/* Footer */}
//           <div className="card-footer">
//             <div className="actions">
//               <i className="fa fa-heart"></i>
//               <i className="fa fa-comment"></i>
//               <i className="fa fa-share"></i>
//             </div>
//             <div className="caption">
//               <span className="username">{post.username}</span> {post.caption}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default InstagramFeed;
