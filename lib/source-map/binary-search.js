/* -*- Mode: js; js-indent-level: 2; -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Source Map.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Nick Fitzgerald <nfitzgerald@mozilla.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
define(function (require, exports, module) {

  /**
   * Recursive implementation of binary search.
   *
   * @param low Indices here and lower do not contain the needle.
   * @param high Indices here and higher do not contain the needle.
   * @param needle The element being searched for.
   * @param haystack The non-empty array being searched.
   * @param compare Function which takes two elements and returns -1, 0, or 1.
   */
  function recursiveSearch (low, high, needle, haystack, compare) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the next
    //      closest element that is less than that element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element which is less than the one we are searching for, so we
    //      return null.
    var mid = Math.floor(high - low / 2) + low;
    var cmp = compare(needle, haystack[mid]);
    if (cmp === 0) {
      // Found the element we are looking for.
      return haystack[mid];
    }
    else if (cmp > 0) {
      // haystack[mid] is greater than our needle.
      if (high - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, high, needle, haystack, compare);
      }
      else {
        // We did not find an exact match, return the next closest one
        // (termination case 2).
        return haystack[mid];
      }
    }
    else {
      // haystack[mid] is less than our needle.
      if (mid - low > 1) {
        // The element is in the lower half.
        return recursiveSearch(low, mid, needle, haystack, compare);
      }
      else {
        // The exact needle element was not found in this haystack. Determine if
        // we are in termination case (2) or (3) and return the appropriate
        // thing.
        return low < 0
          ? null
          : haystack[low];
      }
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the next lowest value checked if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param needle The element you are looking for.
   * @param haystack The array that is being searched.
   * @param compare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   */
  exports.search = function search (needle, haystack, compare) {
    return haystack.length > 0
      ? recursiveSearch(-1, haystack.length, needle, haystack, compare)
      : null;
  };

});
